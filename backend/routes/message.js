// const express = require('express');
// const router = express.Router();
// const Message = require('../models/Message');
// const verifyUserToken = require('../middleware/authMiddleware');
// const verifyDoctorToken = require('../middleware/doctorAuthMiddleware');

// // Combined auth middleware for user or doctor
// function verifyAnyToken(req, res, next) {
//   verifyUserToken(req, res, (userErr) => {
//     if (!userErr) return next();
//     verifyDoctorToken(req, res, (docErr) => {
//       if (!docErr) return next();
//       return res.status(401).json({ error: 'Unauthorized' });
//     });
//   });
// }

// // routes/message.js

// router.post('/send', verifyUserToken, async (req, res) => {
//   const { receiverId, receiverModel, content } = req.body; // ✅ Expecting 'content' from frontend
//   const senderId = req.user?.id || req.doctor?.id;

//   try {
//     const newMsg = new Message({
//       senderId,
//       receiverId,
//       receiverModel,
//       content, // ✅ 'content' matches the schema field
//     });

//     await newMsg.save();
//     res.json({ success: true, message: 'Message sent.' });
//   } catch (err) {
//     console.error('Message send error:', err);
//     res.status(500).json({ error: 'Message send failed.' });
//   }
// });

// router.get("/with/:receiverId", verifyUserToken, async (req, res) => {
//   try {
//     const userId = req.user.id.toString();
//     const receiverId = req.params.receiverId.toString();
//     const page = parseInt(req.query.page) || 1;
//     const limit = 10;
//     const skip = (page - 1) * limit;

//     const query = {
//       $or: [
//         { senderId: userId, receiverId: receiverId },
//         { senderId: receiverId, receiverId: userId }
//       ]
//     };

//     const totalCount = await Message.countDocuments(query);

//     const messages = await Message.find(query)
//       .sort({ timestamp: 1 }) // Ascending by timestamp
//       .skip(skip)
//       .limit(limit);

//     // Serialize ObjectIds to strings
//     const serializedMessages = messages.map((msg) => ({
//       ...msg.toObject(),
//       senderId: msg.senderId.toString(),
//       receiverId: msg.receiverId.toString(),
//     }));

//     res.json({
//       messages: serializedMessages,
//       totalPages: Math.ceil(totalCount / limit),
//     });
//   } catch (error) {
//     console.error("Error fetching messages:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });




// // 3. Clear chat
// router.delete('/clear/:withId', verifyUserToken, async (req, res) => {
//   const userId = req.user?.id || req.doctor?.id;
//   const { withId } = req.params;

//   try {
//     await Message.deleteMany({
//       $or: [
//         { senderId: userId, receiverId: withId },
//         { senderId: withId, receiverId: userId }
//       ]
//     });
//     res.json({ success: true, message: 'Chat cleared.' });
//   } catch (err) {
//     res.status(500).json({ error: 'Error clearing chat.' });
//   }
// });

// router.get('/unread-count', verifyUserToken, async (req, res) => {
//   try {
//     const userId = req.user.id; // Assuming `req.user.id` is populated by authMiddleware

//     // Query the messages where the user is the receiver and the message is unread
//     const unreadCount = await Message.countDocuments({
//       receiverId: userId,
//       isRead: false, // Assuming 'isRead' is the field tracking read/unread status
//     });

//     return res.status(200).json({ unreadCount });
//   } catch (error) {
//     console.error('Error fetching unread count:', error);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const verifyUserToken = require('../middleware/authMiddleware');
const verifyDoctorToken = require('../middleware/doctorAuthMiddleware');

// Combined auth middleware
const verifyAnyToken = (req, res, next) => {
  verifyUserToken(req, res, (userErr) => {
    if (!userErr) {
      req.senderModel = 'User';
      return next();
    }
    verifyDoctorToken(req, res, (docErr) => {
      if (!docErr) {
        req.senderModel = 'Doctor';
        return next();
      }
      return res.status(401).json({ error: 'Unauthorized' });
    });
  });
};

// Message validation function
const validateMessageRequest = (senderModel, receiverModel) => {
  if (senderModel === receiverModel) {
    throw new Error(`${senderModel} cannot message another ${receiverModel}`);
  }
  if (!['User', 'Doctor'].includes(receiverModel)) {
    throw new Error('Invalid receiver type');
  }
};

// Send message
router.post('/send', verifyAnyToken, async (req, res) => {
  const { receiverId, receiverModel, content } = req.body;
  const senderId = req.user?.id || req.doctor?.id;
  const senderModel = req.senderModel;

  if (!senderId || !receiverId || !content || !receiverModel) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    validateMessageRequest(senderModel, receiverModel);

    const newMsg = new Message({
      senderId,
      senderModel,
      receiverId,
      receiverModel,
      content,
    });

    await newMsg.save();
    
    res.json({ 
      success: true, 
      message: 'Message sent successfully',
      data: newMsg
    });
  } catch (err) {
    console.error('Message send error:', err);
    res.status(400).json({ 
      success: false,
      error: err.message || 'Message send failed'
    });
  }
});

// Get messages
router.get("/with/:receiverId", verifyAnyToken, async (req, res) => {
  try {
    const senderId = req.user?.id || req.doctor?.id;
    const receiverId = req.params.receiverId;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const query = {
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    };

    const totalCount = await Message.countDocuments(query);
    const messages = await Message.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    await Message.updateMany(
      { receiverId: senderId, senderId: receiverId, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({
      messages: messages.reverse(),
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Clear chat
router.delete('/clear/:withId', verifyAnyToken, async (req, res) => {
  const senderId = req.user?.id || req.doctor?.id;
  const { withId } = req.params;

  try {
    await Message.deleteMany({
      $or: [
        { senderId, receiverId: withId },
        { senderId: withId, receiverId: senderId }
      ]
    });
    res.json({ success: true, message: 'Chat cleared.' });
  } catch (err) {
    res.status(500).json({ error: 'Error clearing chat.' });
  }
});

// Unread count
router.get('/unread-count', verifyAnyToken, async (req, res) => {
  try {
    const userId = req.user?.id || req.doctor?.id;
    const unreadCount = await Message.countDocuments({
      receiverId: userId,
      isRead: false,
    });
    res.status(200).json({ unreadCount });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
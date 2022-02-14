const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
  res.send('Users route');
});

//update user

router.put('/:id', async(req, res) => {
  if(req.body.userId === req.params.id || req.body.isAdmin){
    if(req.body.password){
      try{
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);
      req.body.password = hash; 
      }
      catch(err){
      return res.status(500).json(err);
      }
    }

    try{
      const user = await User.findByIdAndUpdate(req.params.id,{ $set: req.body});
      
      res.status(200).json("account has been updated");
    }

    
    catch(err){
      return res.status(500).json(err); 
    }
  }

  else 
  {
    return res.status(403).json('you can update only your own profile');
  }
});

//delete user
router.delete('/:id', async(req, res) => {
  if(req.body.userId === req.params.id || req.body.isAdmin)
  {
  
    try{
      const user = await User.findByIdAndDelete(req.params.id);
      
      res.status(200).json("account has been deleted successfully");
    }

    
    catch(err){
      return res.status(500).json(err); 
    }
  }

  else 
  {
    return res.status(403).json('you can delete only your own profile');
  }
});

//get a user

router.get ("/:id", async(req, res) => {
  try{
    const user = await User.findById(req.params.id);
    const {password,updatedAt, ...other}= user._doc
    res.status(200).json(other);
  }
  catch(err)
  {
    res .status(500).json(err);
  }
});


//follow a user
router.put('/follow/:id', async(req, res) => {
  if(req.body.userId !== req.params.id)
  {
    try{
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if(!user.followers.includes(req.body.userId))
      {
        //pushing user id to the followers array
        await user.updateOne({$push: {followers: req.body.userId}});

        await currentUser.updateOne({$push: {followings: req.body.id}});

        res.status(200).json("you have followed the user");
      }
      else
      {
        res.status(403).json("you already following this user");
      }
    }

    catch(err)
    {
      res .status(500).json(err);
    }

  }
  else
  {
     res.status(403).json('you cant follow only your own profile');
  }

});

//unfollow a user

router.put('/unfollow/:id', async(req, res) => {
  if(req.body.userId !== req.params.id)
  {
    try{
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if(user.followers.includes(req.body.userId))
      {
        //pulling user id to the followers array
        await user.updateOne({$pull: {followers: req.body.userId}});

        await currentUser.updateOne({$pull: {followings: req.body.id}});

        res.status(200).json("you have unfollowed this user");
      }
      else
      {
        res.status(403).json("you don't follow this user");
      }
      
    }

    catch(err)
    {
      res .status(500).json(err);
    }

  }
  else
  {
     res.status(403).json('you cant unfollow only your own profile');
  }

});


module.exports = router
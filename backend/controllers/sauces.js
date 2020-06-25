
const Sauce = require('../models/sauce');
const fs = require('fs');


exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Sauce créée avec succès!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
      _id: req.params.id
    }).then(
      (sauce) => {
        res.status(200).json(sauce);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
  };
  
  exports.updateSauce = async (req, res) => {
    try {
        const sauceObject = req.file ?
        {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body};      
        await Sauce.findOneAndUpdate({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        res.status(200).send({ message: 'Objet modifié !'})        
    } catch(err) {
        res.status(500).send(err);   
    }
}
  
  exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};
  
  

// POST /api/sauces/:id 
exports.likeOrDislike = async (req, res) => {
  try {
      const sauce = await Sauce.findById(req.params.id)
      if (req.body.like === 1) { 
          if( !sauce.usersLiked.includes(req.body.userId)) {
              await Sauce.updateOne({ _id: req.params.id }, {
                      $push: {
                          usersLiked: req.body.userId
                      }, 
                      $inc: { 
                          likes: 1 }} )                    
          } 
      res.status(200).send(sauce)
      } else if (req.body.like === 0) {
          if ( sauce.usersLiked.includes(req.body.userId)) {
              await Sauce.updateOne({ _id: req.params.id }, {
                      $pull: {
                          usersLiked: req.body.userId
                      }, 
                      $inc: { 
                          likes: -1 }} )       
          } else if ( sauce.usersDisliked.includes(req.body.userId)) {
              await Sauce.updateOne({ _id: req.params.id }, {
                      $pull: {
                          usersDisliked: req.body.userId
                      }, 
                      $inc: { 
                          dislikes: -1 }} )       
          }
      res.status(200).send(sauce) 
      } else if (req.body.like === -1) {
          if( !sauce.usersDisliked.includes(req.body.userId)) {
              await Sauce.updateOne({ _id: req.params.id }, {
                      $push: {
                          usersDisliked: req.body.userId
                      }, 
                      $inc: { 
                          dislikes: 1 }} )             
          }
      res.status(200).send(sauce)
      }
  } catch (err) {
      res.status(500).send(err)
  }
}
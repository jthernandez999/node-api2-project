// implement your posts router here
const router = require('express').Router()

const { restart } = require('nodemon')
const server = require('../server')
const Post = require('./posts-model')

// GET /api/posts
router.get('/', (req, res) => {
    console.log('Started')
    Post.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(error => {
            console.log(error.message)
            res.status(500).json({
                message: 'The posts information could not be retrieved'
            })
        })
})

// GET /api/posts/:id
router.get('/:id', async (req, res) => {
    Post.findById(req.params.id)
        .then(posts => {
            if (posts) {
                res.status(200).json(posts)
            } else {
                res.status(404).json({
                    message: 'The post with the specified ID does not exist'
                })
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'The post information could not be retrieved',
                error: error.message
            })
        })
})

// DELETE /api/posts/:id 
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        const destroyById = await Post.remove(req.params.id)
        if (!destroyById) return res.status(404).json({ message: 'The post with the specified ID does not exist' })
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json({ message: 'The post could not be removed' })
    }
})

// POST /api/posts
router.post('/', (req, res) => {
    const post = req.body
    if (!post.title || !post.contents) {
        res.status(400).json({
            message: 'Please provide title and contents for the post'
        })
    } else if(post){
        Post.insert(post)
            .then(({ id }) => {
                res.status(201).json({id, ...post})
            })
            .catch(err => {
                res.status(500).json({
                    message: 'There was an error while saving the post to the database',
                    error: err.message
                })
            })
    }

})

// PUT /api/posts/:id
router.put('/:id', (req, res) => {
    const changes = req.body
    const id = req.params.id
    
    if (!changes.title || !changes.contents) {
        res.status(400).json({
            message: 'Please provide title and contents for the post',
        })
    }
    else {
        Post.update(req.params.id, changes)
            .then(post => {
                if (post) {
                    const updatedPost = Post.findById(id)
                    res.status(200).json(updatedPost)
                } else {
                    Post.findById(id)
                    if (!post) {
                        res.status(404).json({
                            message: 'The post with the specified ID does not exist'
                        })
                    }
                }
            })
            .catch(error => {
                res.status(500).json({
                    message: 'The post information could not be modified',
                    error: error.message
                })
            })
    }
})


// GET /api/posts/:id/comments
router.get('/:id/comments', (req, res) => {
    const { id } = req.params
    Post.findById(id)
        .then(post => {
            if (!post) {
                res.status(404).json({
                    message: 'The post with the specified ID does not exist'
                })
            }
        else {
    Post.findPostComments(id)
        .then(comments => {
            res.status(200).json(comments)
        })
}
})
        .catch(error => {
            res.status(500).json({
                message: 'The comments information could not be retrieved',
                error: error.message
            })
        })
        
})



module.exports = router


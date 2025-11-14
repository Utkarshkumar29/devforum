const { Post } = require("../models/postSchema")

const createPost = async (req, res) => {
    const {
        description,
        imageArray,
        document,
        poll_description,
        pollOptions,
        isRepost,
        repostUserId,
        repostDescription
    } = req.body
    console.log(description)
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).send({
                success: false, message: 'Unauthorized'
            })
        }

        const newPostData = { user: req.user._id }
        newPostData.description = description
        if (imageArray && imageArray.length > 0) {
            newPostData.imageArray = imageArray
        }
        if (document) {
            newPostData.document = document
        }

        if (poll_description && Array.isArray(pollOptions) && pollOptions.length > 0) {
            newPostData.poll = {
                poll_description,
                options: pollOptions.map((opt) => ({
                    optionText: opt,
                    votes: 0
                }))
            }
        }

        if (isRepost && repostUserId) {
            newPostData.repost = [
                {
                    user: repostUserId,
                    repost_description: repostDescription || ''
                }
            ]
        }

        if (
            !newPostData.description
        ) {
            return res.status(400).json({
                success: false,
                message: 'Cannot create an empty post',
            });
        }

        const post = new Post(newPostData)
        await post.save()

        await post.populate([
            { path: 'user', select: 'id email display_name photo_url' },
            { path: 'repost.user', select: 'id email display_name photo_url' }
        ])
        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            post,
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Internal Server error",
            error: error.message
        })
    }
}


module.exports = { createPost }
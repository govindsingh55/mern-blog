const { Schema, Types, model, models } = require("mongoose");

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      required: true
    },
    user: {
      type: Types.ObjectId,
      ref: 'UserModel'
    },
    publish: {
      isPublished: {
        type: Boolean,
        default: false
      },
      publishedBy: {
        type: Types.ObjectId,
        ref: 'UserModel'
      },
      publishDate: {
        type: Date,
        default: null
      }
    },
  },
  {
    timestamps: true,
    collection: 'Blog'
  }
);

BlogSchema.index({
  title: 'text',
  slug: 'text'
});

export default models.BlogModel || model('BlogModel', BlogSchema);
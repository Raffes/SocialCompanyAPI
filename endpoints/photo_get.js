const { admin } = require("../auth/auth-admin.js");

const db = admin.firestore();

const listPostsById = async (req, res) => {
  try {
    const { user, page_size = 5, lastDocId = null } = req.query;

    let postsRef = db.collection("posts").where("userId", "==", user).orderBy("createdAt", "desc");

    let query = postsRef.limit(Number(page_size));

    if (lastDocId) {
      const lastDoc = await db.collection("posts").doc(lastDocId).get();
      if(lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    const snapshot = await query.get();

    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const totalSnapshot = await postsRef.count().get();
    const count = totalSnapshot.data().count;

    const lastDoc = snapshot.docs[snapshot.docs.length - 1];

    res.status(200).json({
      posts: posts,
      count: count,
      lastDocId: lastDoc ? lastDoc.id : null
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

module.exports = listPostsById;

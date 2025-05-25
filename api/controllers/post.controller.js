import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const getPosts = async (req, res) => {
  const query = req.query;
  // console.log(query)
  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || 0,
          lte: parseInt(query.maxPrice) || 10000000,
        },
      },
    });
    // setTimeout(() => {
    res.status(200).json(posts);
    // }, 500);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};
export const getPost = async (req, res) => {
  console.log("-----------------------------------------------------");
  console.log(
    "[GET POST /api/posts/:id] Request received at:",
    new Date().toISOString()
  );
  console.log("[GET POST] Raw req.headers.cookie:", req.headers.cookie); // ① 生のCookieヘッダーを確認
  console.log(
    "[GET POST] Parsed req.cookies object by cookie-parser:",
    req.cookies
  ); // ② cookie-parserによる解析結果を確認

  const id = req.params.id;
  console.log(`[LOG 1] getPost 関数開始。PostID: ${id}`);
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });
    console.log(
      `[LOG 2] Postデータ取得完了。Post object:`,
      post ? post.id : "見つかりません"
    );
    if (!post) {
      console.log("[LOG 2A] Postが見つからないため404を返します。");
      return res.status(404).json({ message: "Post not found" });
    }

    const token = req.cookies?.token;
    console.log(`[GET POST LOG 3 REVISED] Value of req.cookies?.token:`, token); // 以前のLOG 3をより詳細に

    if (token) {
      console.log(
        "[LOG 4] トークンが存在するため、jwt.verify を呼び出します（非同期処理）。"
      );
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        console.log("[LOG 6] jwt.verify のコールバック関数が実行されました。");
        if (!err) {
          console.log(
            `[LOG 7A] トークンは有効です。payload.id: ${payload.id}。保存状態を確認します。`
          );
          const saved = await prisma.savedPost.findUnique({
            where: {
              userId_postId: {
                postId: id,
                userId: payload.id,
              },
            },
          });
          console.log(
            `[LOG 7B] 保存状態の確認結果: ${
              saved ? "保存済み" : "未保存"
            }。コールバックからレスポンスを送信します。`
          );
          return res
            .status(200)
            .json({ ...post, isSaved: saved ? true : false });
        } else {
          console.log("[LOG 7C] トークンが無効です。エラー:", err.message);
          return res.status(200).json({ ...post, isSaved: false });
        }
      });
      console.log(
        "[LOG 5] jwt.verify の呼び出し後、getPost 関数のメインフローは継続しています（コールバックより先にこのログが表示されるはずです）。"
      );
    } else {
      console.log(
        "[LOG 8] getPost 関数の最後の res.json に到達しました。isSaved: false でレスポンスを送信します。"
      );
      res.status(200).json({ ...post, isSaved: false });
    }
  } catch (err) {
    console.error(
      "[LOG 9] getPost 関数の try-catch ブロックでエラーが発生しました:",
      err
    );

    if (!res.headersSent) {
      console.log(err);
      res.status(500).json({ message: "Failed to get post" });
    } else {
      console.error("[LOG 9A] エラー発生時には既にヘッダー送信済みでした。");
    }
  }
};
export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;
  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });
    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create posts" });
  }
};
export const updatePost = async (req, res) => {
  try {
    res.status(200).json();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update posts" });
  }
};
export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorize!" });
    }

    await prisma.post.delete({
      where: { id },
    });

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete posts" });
  }
};

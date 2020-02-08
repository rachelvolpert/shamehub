-- users
INSERT INTO "public"."users"("user_id", "email", "name", "password") VALUES(1, 'rachelvolpert@gmail.com', 'Rachel Volpert', 'bananarama') RETURNING "user_id", "email", "name", "password";
INSERT INTO "public"."users"("user_id", "email", "name", "password") VALUES(2, 'nolachen@gmail.com', 'Nola Chen', 'hello') RETURNING "user_id", "email", "name", "password";
-- transactions
INSERT INTO "public"."transactions"("t_id", "user_id", "date", "description", "category", "amount") VALUES(1, 1, '2020-02-07', 'UBER SF', 'Rideshare', 17) RETURNING "t_id", "user_id", "date", "description", "category", "amount";
INSERT INTO "public"."transactions"("t_id", "user_id", "date", "description", "category", "amount") VALUES(2, 2, '2020-02-08', 'HILLSIDE MARKET MA', 'Hillside Market', 5.84) RETURNING "t_id", "user_id", "date", "description", "category", "amount";
INSERT INTO "public"."transactions"("t_id", "user_id", "date", "description", "category", "amount") VALUES(3, 1, '2020-02-08', 'ABERCROMBIE & FITCH', 'Clothing', 80.88) RETURNING "t_id", "user_id", "date", "description", "category", "amount";
-- followers
INSERT INTO "public"."followers"("follower", "followee") VALUES(1, 2) RETURNING "follower", "followee";
INSERT INTO "public"."followers"("follower", "followee") VALUES(2, 1) RETURNING "follower", "followee";
-- comments
INSERT INTO "public"."comments"("commentor", "transaction_id", "comment_text") VALUES(1, 2, 'how shameful') RETURNING "commentor", "transaction_id", "comment_text";
INSERT INTO "public"."comments"("commentor", "transaction_id", "comment_text") VALUES(1, 2, 'LOL') RETURNING "commentor", "transaction_id", "comment_text";
-- reactions
INSERT INTO "public"."reactions"("reactor", "transaction_id", "reaction") VALUES(2, 1, ':angry:') RETURNING "reactor", "transaction_id", "reaction";
INSERT INTO "public"."reactions"("reactor", "transaction_id", "reaction") VALUES(2, 3, ':sad:') RETURNING "reactor", "transaction_id", "reaction";


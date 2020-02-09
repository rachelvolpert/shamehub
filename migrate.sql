CREATE TABLE users (
	user_id serial UNIQUE PRIMARY KEY,
	email varchar(255) UNIQUE NOT NULL,
	name varchar(50) NOT NULL,
	password text NOT NULL
);
CREATE TABLE transactions (
	t_id serial UNIQUE PRIMARY KEY,
	user_id integer NOT NULL,
	date timestamp,
	description varchar(355),
	category varchar(355),
	amount decimal(12,2),
	CONSTRAINT transaction_user_id_fk FOREIGN KEY (user_id)
		REFERENCES users(user_id) MATCH SIMPLE
);
CREATE TABLE followers (
	follower integer NOT NULL,
	followee integer NOT NULL,
	CONSTRAINT follower_fk FOREIGN KEY (follower) 
		REFERENCES users(user_id) MATCH SIMPLE,
	CONSTRAINT followee_fk FOREIGN KEY (followee) 
		REFERENCES users(user_id) MATCH SIMPLE
);
CREATE TABLE reactions (
	reactor integer NOT NULL,
	transaction_id integer NOT NULL, 
	reaction varchar(20) NOT NULL, 
	CONSTRAINT reactor_fk FOREIGN KEY (reactor) 
		REFERENCES users(user_id) MATCH SIMPLE,
	CONSTRAINT transaction_id_fk FOREIGN KEY (transaction_id) 
		REFERENCES transactions(t_id) MATCH SIMPLE
);
CREATE TABLE comments (
	commentor integer NOT NULL,
	transaction_id integer NOT NULL,
	comment_text text NOT NULL, 
	CONSTRAINT commentor_fk FOREIGN KEY (commentor) 
		REFERENCES users(user_id) MATCH SIMPLE,
	CONSTRAINT transaction_id_fk FOREIGN KEY (transaction_id) 
		REFERENCES transactions(t_id) MATCH SIMPLE
);
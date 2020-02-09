CREATE TABLE plaid_access_tokens (
	user_id integer NOT NULL,
	token varchar(255) NOT NULL,
	account_id varchar(255) NOT NULL, 
    bank_name varchar(255) NOT NULL,
	CONSTRAINT user_id_fk FOREIGN KEY (user_id) 
		REFERENCES users(user_id) MATCH SIMPLE
);
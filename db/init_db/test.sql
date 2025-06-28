CREATE TABLE test (
  id int NOT NULL AUTO_INCREMENT primary key,
  name varchar(30),
  description varchar(255)
);

INSERT INTO test (id, name, description) VALUES (1, 'test1', 'This is test data 1');
INSERT INTO test (id, name, description) VALUES (2, 'test2', 'This is test data 2');
INSERT INTO test (id, name, description) VALUES (3, 'test3', 'This is test data 3');
INSERT INTO test (id, name, description) VALUES (4, 'test4', 'This is test data 4');
INSERT INTO test (id, name, description) VALUES (5, 'test5', 'This is test data 5');
INSERT INTO test (id, name, description) VALUES (6, 'test6', 'This is test data 6');
INSERT INTO test (id, name, description) VALUES (7, 'test7', 'This is test data 7');
INSERT INTO test (id, name, description) VALUES (8, 'test8', 'This is test data 8');
INSERT INTO test (id, name, description) VALUES (9, 'test9', 'This is test data 9');
INSERT INTO test (id, name, description) VALUES (10, 'test10', 'This is test data 10');

/* ALTER USER 'docker'@'localhost' IDENTIFIED WITH mysql_native_password BY 'docker' */

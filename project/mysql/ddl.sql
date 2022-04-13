
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `token` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_UN` (`email`),
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO time_server.`Users` (name,username,email,password,token) VALUES
	 ('Kevin Guerra','kevingnet','kevingnet@gmail.com','123456','123456'),
	 ('kg2','kevingnet2','kevingnet2@gmail.com','abcabc','abcabc'),
	 ('Invalid Dude','InvalidDude','invalid@invaliddns.org','000','000');
	 

	 
	 
	 
	 

I. Hướng dẫn cài đặt

1. Mở TERMINAL và gõ lệnh npm install để cài đặt tất cả các package trong file package.json
2. Cài đặt XAMPP
3. Mở phpMyAdmin -> tạo cơ sở dữ liệu mới có tên 'system_booking_a_medical_appointment'
4. Mở TERMINAL và chạy 2 lệnh sau: npx sequelize-cli db:migrate npx sequelize-cli db:seed:all (*)Nếu có lỗi thì hãy chạy lại lệnh sau npm install --save-dev sequelize-cli
5. Gõ lệnh npm start để chạy dự án
   
II. Các tools sử dụng trong BE

1. Bcrypt Bcrypt là một dạng hash function thường sử dụng để mã hóa password với mục đích tăng cường bảo mật. Câu lệnh cài đặt: npm i bcrypt
2. Cors Cors là một cơ chế cho phép nhiều tài nguyên khác nhau (fonts, Javascript, v.v…) của một trang web có thể được truy vấn từ domain khác với domain của trang đó. CORS là viết tắt của từ Cross-origin resource sharing. Câu lệnh cài đặt: npm i cors
3. Express Expressjs là một framework được xây dựng trên nền tảng của Nodejs. Nó cung cấp các tính năng mạnh mẽ để phát triển web hoặc mobile. Expressjs hỗ trợ các method HTTP và midleware tạo ra API vô cùng mạnh mẽ và dễ sử dụng. Câu lệnh cài đặt: npm i express
4. Dotenv Dotenv là một mô-đun mà chúng tôi sẽ sử dụng để truy cập các biến môi trường trong ứng dụng của mình. Khi mộtứng dụng NodeJs chạy, nó sẽ đưa vào một biến toàn cục được gọi là process.env chứa thông tin về trạng thái môi trường mà ứng dụng đang chạy. Dotenv sẽ cho phép chúng ta tải các biến môi trường được lưu trữ trongtệp .env vào process.env . Câu lệnh cài đặt: npm i dotenv
5. Sequelize Sequelize là một ORM dành cho Node.js. Nó hỗ trợ bạn truy cập một cách dễ dàng đến PostgreSQL, MySQL, MariaDB, SQLite và MSSQL cùng với các tính năng như là relations, transaction, replication ... Ở đây mình sử dụng sequelize-cli để thao tác với CSDL. Cài đặt: 5.1 Cài đặt ExpressJs và tạo project Tạo một folder và chạy câu lệnh bên trong folder đó npm install express --save npx express-generator npm install 5.2 Cài đặt Sequelize và các package cần dụng của nó. npm install --save sequelize npm install --save mysql2 npm install --save-dev sequelize-cli npx sequelize-cli init
6. Nodemailer Nodemailer là 1 module cho ứng dụng Node.js cho phép gửi mail 1 cách dễ dàng. Câu lệnh cài đặt: npm i nodemailer
7. UUID UUID là viết tắt của Universally Unique IDentifier, hiểu nôm na là một định danh duy nhất. Mục đích của UUID sinh ra là bởi vì:
  - Dữ liệu lớn, kiểu khóa chính auto imcrement cần nhiều byte để lưu hơn. Và khóa chính kiểu này không phù hợp khi mà hệ thống có nhiều server, nhiều client cùng lúc truy cập trên toàn thế giới.
  - Nếu dùng khóa chính kiểu auto imcrement, có thể dễ dàng truy ra được trong database có bao nhiêu record. Thường thấy ở đường dẫn kiểu "domain.com/user/12345". Câu lệnh cài đặt: npm i uuid

// Requiring bcrypt for password hashing. Using the bcryptjs version as the regular bcrypt module sometimes causes errors on Windows machines
var bcrypt = require("bcryptjs");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  User.addHook("beforeCreate", function (User) {
    User.password = bcrypt.hashSync(User.password, bcrypt.genSaltSync(10));
  });
  return User;
};

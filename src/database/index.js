import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import configDatabase from '../config/database'

import User from '../app/controllers/models/User';
import Product from '../app/controllers/models/Product';
import Category from '../app/controllers/models/Category';

const models = [User, Product, Category];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }
  
  init() {
    this.connection = new Sequelize(configDatabase);
    models
      .map((model) => model.init(this.connection))
      .map(
        // biome-ignore lint/complexity/useOptionalChain: <explanation>
        (model) => model.associate && model.associate(this.connection.models),
      );
  };

  mongo() {
    mongoose.connect('mongodb://localhost:27017/devburger')
      .then(() => console.log('MongoDB connected successfully.'))
      .catch((error) => {
        console.error('MongoDB connection error:', error);
      });
  }
}

export default new Database();

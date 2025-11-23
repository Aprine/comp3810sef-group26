console.log(' ');
console.log('【调试】当前时间：', new Date().toISOString());
console.log('【调试】MONGODB_URI =', process.env.MONGODB_URI ? '存在（长度' + process.env.MONGODB_URI.length + '）' : 'undefined');
console.log('【调试】MONGO_URI =', process.env.MONGO_URI ? '存在（长度' + process.env.MONGO_URI.length + '）' : 'undefined');
console.log('【调试】所有包含 MONGO 的环境变量：', Object.keys(process.env).filter(k => k.toUpperCase().includes('MONGO')));
console.log(' ================================== ');

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');
const Dish = require('./models/Dish');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URL || 'mongodb://localhost:27017/canteen';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'comp3810-canteen-secret-2025',
  resave: false,
  saveUninitialized: false,
  store: store
}));
app.set('view engine', 'ejs');

// Routes: Register
app.get('/register', (req, res) => res.render('register'));
app.post('/register', async (req, res) => {
  const { username, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.send('Passwords do not match! <a href="/register">Back</a>');
  }
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.send('Username already exists! <a href="/register">Back</a>');
    }
    await User.create({ username, password });
    req.session.loggedIn = true;
    req.session.username = username;
    res.redirect('/');
  } catch (err) {
    res.send('Registration failed! <a href="/register">Back</a>');
  }
});

// Routes: Login
app.get('/login', (req, res) => res.render('login'));
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  // Legacy admin support
  if (username === 'admin' && password === 'comp3810') {
    req.session.loggedIn = true;
    req.session.username = 'admin';
    return res.redirect('/');
  }
  // Database user
  try {
    const user = await User.findOne({ username });
    if (user && await user.comparePassword(password)) {
      req.session.loggedIn = true;
      req.session.username = username;
      res.redirect('/');
    } else {
      res.send('Invalid credentials <a href="/login">Back</a>');
    }
  } catch (err) {
    res.send('Login error <a href="/login">Back</a>');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Middleware
const requireAuth = (req, res, next) => {
  if (req.session.loggedIn) next();
  else res.redirect('/login');
};

// Home
// Home - 支持搜索（Originality bonus!）
app.get('/', async (req, res) => {
  const query = req.query;
  const filter = {};

  // 按菜名模糊搜索
  if (query.name) {
    filter.name = { $regex: query.name, $options: 'i' }; // 不区分大小写
  }

  // 按类别精确匹配
  if (query.category) {
    filter.category = query.category;
  }

  // 是否只看辣菜
  if (query.spicy === 'on') {
    filter.spicy = true;
  }

  // 价格筛选：任意身份价格不超过 maxPrice
  if (query.maxPrice) {
    const max = parseFloat(query.maxPrice);
    filter.$or = [
      { "price.student": { $lte: max } },
      { "price.staff":   { $lte: max } },
      { "price.visitor": { $lte: max } }
    ];
  }

  const dishes = await Dish.find(filter).sort({ category: 1, name: 1 });

  res.render('index', { 
    dishes, 
    isAdmin: req.session.loggedIn,
    session: req.session,
    query: query  // 把查询参数传回页面，保持表单状态
  });
});

// RESTful APIs
app.get('/api/dishes', async (req, res) => {
  const dishes = await Dish.find();
  res.json(dishes);
});

app.post('/api/dishes', requireAuth, async (req, res) => {
  const dish = new Dish(req.body);
  await dish.save();
  res.status(201).json(dish);
});

app.put('/api/dishes/:id', requireAuth, async (req, res) => {
  const dish = await Dish.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(dish);
});

app.delete('/api/dishes/:id', requireAuth, async (req, res) => {
  await Dish.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
});

// Admin pages
app.get('/add', requireAuth, (req, res) => res.render('add'));
app.get('/edit/:id', requireAuth, async (req, res) => {
  const dish = await Dish.findById(req.params.id);
  res.render('edit', { dish });
});

app.post('/add', requireAuth, async (req, res) => {
  await new Dish(req.body).save();
  res.redirect('/');
});

app.post('/edit/:id', requireAuth, async (req, res) => {
  await Dish.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/');
});

app.post('/delete/:id', requireAuth, async (req, res) => {
  await Dish.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

// Start server + seed data
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (await Dish.countDocuments() === 0) {
    const sample = require('./sample-data');
    await Dish.insertMany(sample);
    console.log('25 sample dishes inserted (Student/Staff/Visitor prices)');
  }
});
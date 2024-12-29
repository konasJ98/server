// db.js
const { Sequelize, DataTypes, Model } = require('sequelize');
var debug = require('debug')('server:db');

// Replace the MySQL config with SQLite config
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './data/database.sqlite', // The path to the SQLite file (relative or absolute)
});

// Test the connection to the database
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

//This table is the songpool
class dbSong extends Model {};
dbSong.init(
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tempo: {
      type: DataTypes.INTEGER,
      // allowNull defaults to true
    },
    duration: {
      type: DataTypes.DATE,
    },
    originalkey: {
      type: DataTypes.ENUM,
      values: ['C', 'G', 'D', 'A', 'E', 'B', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F',
              'Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m', 'Bm', 'Fm', 'Cm', 'Gm', 'Dm'],
      allowNull: false
    },
    transpose: {
      type: DataTypes.INTEGER
    },
    mood: {
      type: DataTypes.ENUM,
      values: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange', 'Pink', 'Black', 'White', 'Gray']
    },
    progress: {
      type: DataTypes.ENUM,
      values: [1, 2, 3, 4, 5]
    },
    genre: {
      type: DataTypes.ENUM,
      values: ['Rock', 'Pop', 'Metal', 'Funk', 'Hip Hop', 'Jazz', 'Classical',
        'Blues', 'Reggae', 'Country', 'Electronic', 'R&B', 'Soul',
        'Punk', 'Indie', 'Alternative', 'Techno', 'House', 'Disco', 'Latin']
    },
    energy: {
      type: DataTypes.ENUM,
      values: [1, 2, 3, 4, 5]
    }
  },
  {
    sequelize
  }
);

//this table contains all setlists (metadata only)
class dbList extends Model {};
dbList.init(
  {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    }
  },
  {
    sequelize
  }
);

//this contains the contents of all setlists
class dbItem extends Model {};
dbItem.init(
  {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    listId: {
        type: DataTypes.INTEGER,
        references: { model: dbList, key: 'id' },
        allowNull: false,
      },
    itemId: {
        type: DataTypes.INTEGER,
        references: { model: dbItem, key: 'id' },
        allowNull: false,
      },
    order: {
        type: DataTypes.INTEGER, // Explicit order for drag-and-drop
        allowNull: false,
      }
  },
  {
    sequelize
  }
);

//sync all models
(async () => {
    await sequelize.sync();
    // Code here
    console.log('All models were synchronized successfully.');
  })();


async function createSong(Name) {
    song = dbSong.build({name: Name});
  }

async function createList() {
    song = dbList.build();
  }

module.exports = { sequelize, testConnection };

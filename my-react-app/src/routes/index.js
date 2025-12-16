import accountRoutes from './accountRoutes.js';
import leaderboardRoutes from './leaderboardRoutes.js'

const constructorMethod = (app) => {


  app.use('/account', accountRoutes);
  //app.use('/users', userRoutes);
  app.use('/leaderboard', leaderboardRoutes);

  app.use(/wild/, (req, res) => {
    return res.status(404).json({error: 'Not found'});
  });
};

export default constructorMethod;
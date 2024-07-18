const controller = require('../controllers/default');

module.exports = function (router) {
  /* GET pages. */
  router.get('/', controller.renderForm);
  router.get('/login', controller.renderLogin);
  router.get('/admin', controller.renderAdmin);
  router.get('/edit', controller.renderEdit);
  router.get('/success', controller.renderSuccess);
  router.get('/unavailable', controller.renderUnavailable);
  router.post('/booking', controller.form.booking);
  router.post('/download/analysis', controller.form.downloadAnalysis);
  router.post('/edit/:id', (req, res) => {
    controller.renderEdit(req, res, req.params.id);
  });
  router.post('/update/:id', (req, res) => {
    controller.edit.update(req, res, req.params.id);
  });
  router.post('/delete/:id', (req, res) => {
    controller.edit.deleteReservation(req, res, req.params.id);
  });
  router.post('/search', controller.admin.searchReservations);
  router.post('/login', controller.login.login);
  router.post('/verifyInputBottles', controller.form.verifyInputBottles);
  router.post('/logout', (req, res) => {
    controller.logout.logout(req, res);
  });
  router.post('/admin/upload', controller.admin.uploadFile);
  router.post('/admin/export', controller.admin.exportData);
  router.post('/admin/suspend/add', controller.admin.setSuspendDates);
  router.post('/admin/suspend/manual', controller.admin.manuallySuspend);
  router.post('/admin/suspend/remove', controller.admin.removeSuspend);
}

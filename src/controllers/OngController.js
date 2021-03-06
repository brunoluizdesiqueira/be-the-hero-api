const generateUniqueId = require('../utils/generateUniqueId');
const connection = require('../database/connection');

class OngController {

  async index(req, res) {
    const ongs = await connection('ongs').select('*');
    return res.json({ ongs });
  }

  async store(req, res) {
    const { name, email, whatsapp, city, uf } = req.body;
    const id = generateUniqueId();
    await connection('ongs').insert({
      id, name, email, whatsapp, city, uf,
    });
    return res.json({ id });
  }

  async delete(req, res) {
    const { id } = req.params;
    await connection('ongs').where({ id: id }).del();
    return res.json({response: `ong ${id} deleted with success.`});
  }

  async deleteAll(req, res) {
    const { id } = req.params;
    await connection('ongs').del();
    return res.json({response: 'All Ongs deleted with success.'});
  }
}

module.exports = new OngController();

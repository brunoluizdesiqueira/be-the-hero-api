import connection from '../database/connection'

class IncidentController {

  async index(req, res) {
    const { page = 1 } = req.query;

    const [count] = await connection('incidents')
      .count('*');

    const incident = await connection('incidents')
      .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
      .limit(5)
      .offset((page - 1) * 5)
      .select([
        'incidents.*',
        'ongs.name',
        'ongs.email',
        'ongs.whatsapp',
        'ongs.city',
        'ongs.uf'
      ]);

    res.header('x-Total-Count', count['count(*)']);

    return res.json(incident);
  }

  async store(req, res) {
    const { title, description, value } = req.body;
    const ong_id = req.headers.authorization;

    const [ id ] = await connection('incidents').insert({
      title,
      description,
      value,
      ong_id,
    });
    return res.json({ id });
  }

  async delete(req, res) {
    const { id } = req.params;
    const ong_id = req.headers.authorization;

    const incident = await connection('incidents')
      .where('id', id)
      .select('ong_id')
      .first();

    if (!incident) {
      return res.status(401).json({error: 'Incident not exists.'});
    }

    if (incident.ong_id !== ong_id) {
      return res.status(401).json({error: 'Operation not permitted.'});
    }

    await connection('incidents').where({ id: id }).del();
    return res.status(204).send();
  }
}

export default new IncidentController();

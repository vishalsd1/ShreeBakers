import app from '../backend/app.cjs';

export default function handler(req, res) {
  return app(req, res);
}

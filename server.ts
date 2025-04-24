import express, { Request, Response } from 'express';
import cors from 'cors';

interface Item {
  id: number;
  value: string;
}

interface MoveBody {
  from: number;
  to: number;
}

interface SelectBody {
  id: number;
}

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const items: Item[] = Array.from({ length: 1000000 }, (_, i) => ({
  id: i + 1,
  value: `Item ${i + 1}`
}));
let sortedItems: Item[] = [...items];
let selectedItems: number[] = [];

app.get('/items', (req: Request, res: Response) => {
  const offsetStr = req.query.offset as string | undefined;
  const limitStr = req.query.limit as string | undefined;
  const offset = parseInt(offsetStr ?? '0', 10);
  const end = offset + parseInt(limitStr ?? '20', 10);
  res.json(sortedItems.slice(offset, end));
});

app.post('/move', (req: Request, res: Response) => {
  console.log(req);
  const { from, to }: MoveBody = req.body;
  const [removed] = sortedItems.splice(from, 1);
  sortedItems.splice(to, 0, removed);
  res.json({ success: true });
});

app.post('/select', (req: Request, res: Response) => {
  const { id }: SelectBody = req.body;
  if (!selectedItems.includes(id)) {
    selectedItems.push(id);
  }
  res.json({ success: true });
});

app.post('/deselect', (req: Request, res: Response) => {
  const { id }: SelectBody = req.body;
  selectedItems = selectedItems.filter(s => s !== id);
  res.json({ success: true });
});

app.get('/selected', (req: Request, res: Response) => {
  res.json(selectedItems);
});

app.get('/search', (req: Request, res: Response) => {
  const q = req.query.q as string | undefined;
  const offsetStr = req.query.offset as string | undefined;
  const limitStr = req.query.limit as string | undefined;
  const searchTerm = q ?? '';
  const offset = parseInt(offsetStr ?? '0', 10);
  const limit = parseInt(limitStr ?? '20', 10);
  const filtered = sortedItems.filter(item => item.value.toLowerCase().includes(searchTerm.toLowerCase()));
  const start = offset;
  const end = start + limit;
  res.json(filtered.slice(start, end));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
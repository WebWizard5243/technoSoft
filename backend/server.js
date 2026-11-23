import express from "express";
import env from "dotenv";
import {Pool} from "pg";
import {z} from "zod";
import cors from "cors";
env.config();

const pool = new Pool({
    connectionString : process.env.DATABASE_STRING,
})

const app = express();
const PORT = process.env.PORT;
app.use(cors({
  origin:[
    "https://techno-soft-ws3n.vercel.app/"
  ]
}));
app.use(express.json());


const leadsSchema = z.object({
  name : z.string().trim().min(1 , "name is required").max(100),
  email : z.string().trim().toLowerCase().email('Invalid email'),
  phone : z.string().regex(/^\d{10}$/ , "phone number must contain at least 10 digits").max(15 , "phone number must not exceed 15 digits"),
  company : z.string().trim().min(1 , "company name is required"),
  source : z.string().trim().min(1 , "source name is required"),
  status : z.enum(['New', 'Contacted', 'Qualified', 'Lost']).default('New'),
})



app.get('/getLeads', async(req,res) => {
  
  const {search, status} = req.query;
   try {
    let query = "SELECT * FROM leads WHERE 1=1";
    const params = [];
    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      query += ` AND name ILIKE $${params.length}`;
    }
    query += " ORDER BY created_at DESC";
    const response = await pool.query(query, params);
    res.status(200).json(response.rows);
  } catch (error) {
    console.error("error while fetching leads :", error);
    res.status(500).json({ error: "error fetching leads" });
  }
})

app.post("/addLeads", async(req,res) => {
  const parsedData =leadsSchema.safeParse(req.body);
  if(!parsedData.success){
    return res.status(400).json({errors: parsedData.error.flatten().fieldErrors})
  }
  const {name, email, phone, company, source, status} = parsedData.data;
  try {
    const response = await pool.query("INSERT INTO leads(name, email, phone, company,source, status) VALUES($1,$2,$3,$4,$5,$6) RETURNING *",[name, email, phone, company,source, status || 'new']);
    res.status(201).json(response.rows[0]);
  } catch (error) {
    if(error.code === '23505'){
      return res.status(400).json({ error : "A lead with this email already exists"});
    }
    console.error("error adding a lead : ",error);
    res.status(500).json({error : "Error adding lead"});
  }
})

app.patch("/leads/:id", async(req, res) => {
  const parsedData =leadsSchema.partial().safeParse(req.body);
  if(!parsedData.success){
    return res.status(400).json({errors: parsedData.error.flatten().fieldErrors})
  }
  const {name, email, phone, company, source, status} = parsedData.data;
  const id = req.params.id;
  try {
    const response = await pool.query(`UPDATE leads SET
      name = COALESCE($1, name),
      email = COALESCE($2, email),
      phone = COALESCE($3, phone),
      company = COALESCE($4, company),
      source = COALESCE($5, source),
      status = COALESCE($6, status),
      updated_at = NOW()
      WHERE id = $7
      RETURNING *`,
    [
      name ?? null,
      email ?? null,
      phone ?? null,
      company ?? null,
      source ?? null,
      status ?? null,
      id
    ]);

    if(response.rowCount == 0){
      return res.status(404).json({error :" Lead not found"})
    }
    res.status(200).json(response.rows[0]);
  } catch (error) {
    if(error.code === '23505'){
      return res.status(400).json({error : "email already exists"});
    }
    console.error("error while updating :", error);
    res.status(500).json({error : error.message || "error while updating status"})
  }
})


app.delete("/deleteLeads/:id", async(req, res) => {
  const id = req.params.id;
  try {
    const response = await pool.query("DELETE FROM leads WHERE id = $1",[id])
    if(response.rowCount == 0){
     return res.status(404).json({error : "lead not found"});
    }
    res.status(200).json({success : "lead deleted succesfully"});
  } catch (error) {
    console.error("error while deleting lead : " , error);
    res.status(500).json({error : "something went wrong"});
  }
})

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, db: 'connected' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, db: 'down' });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})
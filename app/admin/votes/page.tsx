-- Vérifier les contraintes sur vote_reponses
SELECT pg_get_constraintdef(oid), conname
FROM pg_constraint 
WHERE conrelid = 'vote_reponses'::regclass;

-- S'assurer que vote_reponses accepte les insertions publiques
ALTER TABLE vote_reponses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pub_insert_vote_reponse" ON vote_reponses;
DROP POLICY IF EXISTS "pub_read_vote_reponses" ON vote_reponses;
DROP POLICY IF EXISTS "admin_vote_reponses" ON vote_reponses;

CREATE POLICY "pub_insert_vote_reponse" ON vote_reponses 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "pub_read_vote_reponses" ON vote_reponses 
  FOR SELECT USING (true);

CREATE POLICY "admin_vote_reponses" ON vote_reponses 
  FOR ALL USING (auth.role() = 'authenticated');

-- Vérifier que votes est bien accessible
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pub_read_votes" ON votes;
DROP POLICY IF EXISTS "admin_votes" ON votes;

CREATE POLICY "pub_read_votes" ON votes 
  FOR SELECT USING (actif = true);

CREATE POLICY "admin_votes" ON votes 
  FOR ALL USING (auth.role() = 'authenticated');

SELECT 'Votes corrigé ✅' as status;

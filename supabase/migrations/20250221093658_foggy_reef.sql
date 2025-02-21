/*
  # Update specific story title

  Updates the title for story with ID 96585e1a-17cc-41e6-86e7-c296b5e948df
*/

DO $$ 
BEGIN
  UPDATE stories
  SET title = 'The Magical Winter Adventure'
  WHERE id = '96585e1a-17cc-41e6-86e7-c296b5e948df';
END $$;
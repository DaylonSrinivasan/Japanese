// Currently, I'm manually applying these constraints to DB.
CREATE CONSTRAINT FOR (t:Translation) REQUIRE t.japanese IS UNIQUE;
CREATE CONSTRAINT FOR (u:User) REQUIRE u.name IS UNIQUE;

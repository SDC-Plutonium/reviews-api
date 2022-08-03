CREATE TABLE "reviews"(
    "id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "recommend" BOOLEAN NOT NULL,
    "reported" BOOLEAN NOT NULL,
    "reviewer_name" TEXT NOT NULL,
    "reviewer_email" TEXT NOT NULL,
    "response" TEXT NULL,
    "helpfulness" INTEGER NOT NULL
);
CREATE INDEX "reviews_product_id_index" ON
    "reviews"("product_id");
ALTER TABLE
    "reviews" ADD PRIMARY KEY("id");
CREATE TABLE "characteristics"(
    "id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL
);
CREATE INDEX "characteristics_product_id_index" ON
    "characteristics"("product_id");
ALTER TABLE
    "characteristics" ADD PRIMARY KEY("id");
CREATE TABLE "characteristics_reviews"(
    "id" INTEGER NOT NULL,
    "characteristic_id" INTEGER NOT NULL,
    "review_id" INTEGER NOT NULL,
    "value" INTEGER NOT NULL
);
CREATE INDEX "characteristics_reviews_review_id_index" ON
    "characteristics_reviews"("review_id");
ALTER TABLE
    "characteristics_reviews" ADD PRIMARY KEY("id");
CREATE TABLE "reviews_photos"(
    "id" INTEGER NOT NULL,
    "review_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL
);
CREATE INDEX "reviews_photos_review_id_index" ON
    "reviews_photos"("review_id");
ALTER TABLE
    "reviews_photos" ADD PRIMARY KEY("id");
ALTER TABLE
    "reviews_photos" ADD CONSTRAINT "reviews_photos_review_id_foreign" FOREIGN KEY("review_id") REFERENCES "reviews"("id");
ALTER TABLE
    "characteristics_reviews" ADD CONSTRAINT "characteristics_reviews_review_id_foreign" FOREIGN KEY("review_id") REFERENCES "reviews"("id");
ALTER TABLE
    "characteristics_reviews" ADD CONSTRAINT "characteristics_reviews_characteristic_id_foreign" FOREIGN KEY("characteristic_id") REFERENCES "characteristics"("id");
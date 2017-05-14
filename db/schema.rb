# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170513233855) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "arguments", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "premise_sources", force: :cascade do |t|
    t.integer  "premise_id"
    t.integer  "source_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["premise_id"], name: "index_premise_sources_on_premise_id", using: :btree
    t.index ["source_id"], name: "index_premise_sources_on_source_id", using: :btree
  end

  create_table "premises", force: :cascade do |t|
    t.integer  "argument_id"
    t.string   "name"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.index ["argument_id"], name: "index_premises_on_argument_id", using: :btree
  end

  create_table "sources", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "supporting_premises", force: :cascade do |t|
    t.integer  "parent_premise_id"
    t.integer  "premise_id"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
    t.index ["parent_premise_id"], name: "index_supporting_premises_on_parent_premise_id", using: :btree
    t.index ["premise_id"], name: "index_supporting_premises_on_premise_id", using: :btree
  end

  add_foreign_key "premise_sources", "premises"
  add_foreign_key "premise_sources", "sources"
  add_foreign_key "premises", "arguments"
  add_foreign_key "supporting_premises", "premises"
  add_foreign_key "supporting_premises", "premises", column: "parent_premise_id"
end

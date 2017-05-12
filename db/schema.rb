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

ActiveRecord::Schema.define(version: 20170512005551) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "arguments", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "premises", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "premises_arguments", id: false, force: :cascade do |t|
    t.integer "premise_id"
    t.integer "argument_id"
    t.index ["argument_id"], name: "index_premises_arguments_on_argument_id", using: :btree
    t.index ["premise_id"], name: "index_premises_arguments_on_premise_id", using: :btree
  end

  create_table "premises_sources", id: false, force: :cascade do |t|
    t.integer "premise_id"
    t.integer "source_id"
    t.index ["premise_id"], name: "index_premises_sources_on_premise_id", using: :btree
    t.index ["source_id"], name: "index_premises_sources_on_source_id", using: :btree
  end

  create_table "sources", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end

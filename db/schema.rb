# encoding: UTF-8
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

ActiveRecord::Schema.define(version: 20151228223910) do

  create_table "courses", force: :cascade do |t|
    t.string "code", null: false
    t.string "name", null: false
    t.index ["code"], name: "index_courses_on_code", unique: true
  end

  create_table "exercise_categories", force: :cascade do |t|
    t.string   "name",       limit: 100
    t.string   "short_name", limit: 30
    t.integer  "course_id"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.index ["course_id"], name: "index_exercise_categories_on_course_id"
  end

  create_table "exercise_types", force: :cascade do |t|
    t.string   "name",                 limit: 100
    t.string   "short_name",           limit: 30
    t.integer  "exercise_number"
    t.integer  "language_id"
    t.integer  "exercise_category_id"
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
    t.index ["exercise_category_id"], name: "index_exercise_types_on_exercise_category_id"
    t.index ["language_id"], name: "index_exercise_types_on_language_id"
  end

  create_table "languages", force: :cascade do |t|
    t.string   "code",       limit: 3
    t.string   "name",       limit: 30
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
  end

  create_table "semesters", force: :cascade do |t|
    t.integer "course_id",     null: false
    t.integer "academic_year", null: false
    t.integer "academic_term", null: false
    t.index ["course_id", "academic_year", "academic_term"], name: "index_semesters_on_all_attributes", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "name",            limit: 100,  null: false
    t.string "email",           limit: 100
    t.string "password_digest", limit: 100
    t.string "eppn",            limit: 30
    t.text   "ssh_public_keys", limit: 4096
    t.string "neptun",          limit: 6
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["eppn"], name: "index_users_on_eppn", unique: true
    t.index ["name"], name: "index_users_on_name", unique: true
    t.index ["neptun"], name: "index_users_on_neptun", unique: true
  end

end

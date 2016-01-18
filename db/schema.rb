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

ActiveRecord::Schema.define(version: 20160114192756) do

  create_table "appointments", force: :cascade do |t|
    t.datetime "date"
    t.string   "location",          limit: 30
    t.integer  "student_group_id"
    t.integer  "event_template_id"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.index ["event_template_id"], name: "index_appointments_on_event_template_id"
    t.index ["student_group_id"], name: "index_appointments_on_student_group_id"
  end

  create_table "clients", force: :cascade do |t|
    t.string   "code"
    t.string   "name"
    t.integer  "course_id"
    t.integer  "default_language_id"
    t.integer  "extended_client_id"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.index ["course_id"], name: "index_clients_on_course_id"
    t.index ["default_language_id"], name: "index_clients_on_default_language_id"
    t.index ["extended_client_id"], name: "index_clients_on_extended_client_id"
  end

  create_table "courses", force: :cascade do |t|
    t.string "code", null: false
    t.string "name", null: false
    t.index ["code"], name: "index_courses_on_code", unique: true
  end

  create_table "deliverable_templates", force: :cascade do |t|
    t.string   "format",            limit: 30
    t.integer  "deadline"
    t.string   "title",             limit: 30
    t.string   "description"
    t.integer  "event_template_id"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.index ["event_template_id"], name: "index_deliverable_templates_on_event_template_id"
  end

  create_table "deliverables", force: :cascade do |t|
    t.string   "type",                    limit: 30
    t.datetime "deadline"
    t.datetime "submitted_date"
    t.string   "title",                   limit: 30
    t.string   "description"
    t.integer  "event_id"
    t.integer  "deliverable_template_id"
    t.integer  "upstream_deliverable_id"
    t.string   "url",                     limit: 100
    t.string   "commit",                  limit: 100
    t.integer  "size"
    t.string   "checksum_algorithm",      limit: 30
    t.string   "checksum"
    t.string   "filename",                limit: 30
    t.integer  "directory_id"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.index ["deliverable_template_id"], name: "index_deliverables_on_deliverable_template_id"
    t.index ["directory_id"], name: "index_deliverables_on_directory_id"
    t.index ["event_id"], name: "index_deliverables_on_event_id"
    t.index ["upstream_deliverable_id"], name: "index_deliverables_on_upstream_deliverable_id"
  end

  create_table "directories", force: :cascade do |t|
    t.string   "description",   limit: 30
    t.string   "relative_path"
    t.integer  "semester_id"
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
    t.index ["semester_id"], name: "index_directories_on_semester_id"
  end

  create_table "evaluation_types", force: :cascade do |t|
    t.string   "name",        limit: 30
    t.string   "description"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  create_table "evaluations", force: :cascade do |t|
    t.integer  "grade"
    t.date     "grade_date"
    t.string   "comment"
    t.string   "comment_for_staff"
    t.integer  "evaluation_type_id"
    t.integer  "staff_id"
    t.string   "evaluatable_type"
    t.integer  "evaluatable_id"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
    t.index ["evaluatable_type", "evaluatable_id"], name: "index_evaluations_on_evaluatable_type_and_evaluatable_id"
    t.index ["evaluation_type_id"], name: "index_evaluations_on_evaluation_type_id"
    t.index ["staff_id"], name: "index_evaluations_on_staff_id"
  end

  create_table "event_templates", force: :cascade do |t|
    t.string   "title",                limit: 30
    t.integer  "number"
    t.integer  "course_id"
    t.integer  "exercise_category_id"
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
    t.index ["course_id"], name: "index_event_templates_on_course_id"
    t.index ["exercise_category_id"], name: "index_event_templates_on_exercise_category_id"
  end

  create_table "events", force: :cascade do |t|
    t.datetime "date"
    t.string   "location",          limit: 30
    t.integer  "number"
    t.string   "title",             limit: 30
    t.integer  "attempt"
    t.integer  "student_group_id"
    t.integer  "event_template_id"
    t.integer  "demonstrator_id"
    t.integer  "exercise_type_id"
    t.integer  "upstream_event_id"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.index ["demonstrator_id"], name: "index_events_on_demonstrator_id"
    t.index ["event_template_id"], name: "index_events_on_event_template_id"
    t.index ["exercise_type_id"], name: "index_events_on_exercise_type_id"
    t.index ["student_group_id"], name: "index_events_on_student_group_id"
    t.index ["upstream_event_id"], name: "index_events_on_upstream_event_id"
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

  create_table "messages", force: :cascade do |t|
    t.string   "code"
    t.string   "message_text"
    t.integer  "client_id"
    t.integer  "language_id"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.index ["client_id"], name: "index_messages_on_client_id"
    t.index ["language_id"], name: "index_messages_on_language_id"
  end

  create_table "semesters", force: :cascade do |t|
    t.integer "course_id",     null: false
    t.integer "academic_year", null: false
    t.integer "academic_term", null: false
    t.index ["course_id", "academic_year", "academic_term"], name: "index_semesters_on_all_attributes", unique: true
  end

  create_table "staffs", force: :cascade do |t|
    t.integer  "semester_id"
    t.integer  "user_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.index ["semester_id"], name: "index_staffs_on_semester_id"
    t.index ["user_id"], name: "index_staffs_on_user_id"
  end

  create_table "student_groups", force: :cascade do |t|
    t.string   "name",            limit: 30
    t.integer  "language_id"
    t.integer  "semester_id"
    t.integer  "demonstrator_id"
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.index ["language_id"], name: "index_student_groups_on_language_id"
    t.index ["semester_id"], name: "index_student_groups_on_semester_id"
  end

  create_table "student_to_events", force: :cascade do |t|
    t.integer  "student_id"
    t.integer  "event_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["event_id"], name: "index_student_to_events_on_event_id"
    t.index ["student_id"], name: "index_student_to_events_on_student_id"
  end

  create_table "student_to_student_groups", force: :cascade do |t|
    t.integer  "student_id"
    t.integer  "student_group_id"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.index ["student_group_id"], name: "index_student_to_student_groups_on_student_group_id"
    t.index ["student_id"], name: "index_student_to_student_groups_on_student_id"
  end

  create_table "students", force: :cascade do |t|
    t.string   "neptun_subject_code", limit: 30
    t.string   "neptun_course_code",  limit: 30
    t.integer  "language_id"
    t.integer  "semester_id"
    t.integer  "user_id"
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
    t.index ["language_id"], name: "index_students_on_language_id"
    t.index ["semester_id"], name: "index_students_on_semester_id"
    t.index ["user_id"], name: "index_students_on_user_id"
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

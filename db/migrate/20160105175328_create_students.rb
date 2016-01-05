class CreateStudents < ActiveRecord::Migration
  def change
    create_table :students do |t|
      t.string :neptun_subject_code, limit: 30
      t.string :neptun_course_code, limit: 30
      t.references :language, index: true, foreign_key: true
      t.references :semester, index: true, foreign_key: true
      t.references :user, index: true, foreign_key: true

      t.timestamps
    end
  end
end

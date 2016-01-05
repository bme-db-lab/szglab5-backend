class CreateStudentToStudentGroups < ActiveRecord::Migration
  def change
    create_table :student_to_student_groups do |t|
      t.references :student, index: true, foreign_key: true
      t.references :student_group, index: true, foreign_key: true

      t.timestamps
    end
  end
end

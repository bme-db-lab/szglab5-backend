class CreateStudentGroups < ActiveRecord::Migration
  def change
    create_table :student_groups do |t|
      t.string :name, limit: 30
      t.references :language, index: true, foreign_key: true
      t.references :semester, index: true, foreign_key: true
      t.references :demonstrator, foreign_key: {to_table: :staff}

      t.timestamps
    end
  end
end

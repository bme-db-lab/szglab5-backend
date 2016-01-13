class CreateStudentToEvents < ActiveRecord::Migration
  def change
    create_table :student_to_events do |t|
      t.references :student, index: true, foreign_key: true
      t.references :event, index: true, foreign_key: true

      t.timestamps
    end
  end
end

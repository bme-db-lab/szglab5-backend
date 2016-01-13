class CreateEvaluations < ActiveRecord::Migration
  def change
    create_table :evaluations do |t|
      t.integer :grade
      t.date :grade_date
      t.string :comment
      t.string :comment_for_staff
      t.references :evaluation_type, index: true, foreign_key: true
      t.references :staff, index: true, foreign_key: true
      t.references :evaluatable, polymorphic: true, index: true

      t.timestamps
    end
  end
end

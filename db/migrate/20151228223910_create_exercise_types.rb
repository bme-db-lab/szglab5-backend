class CreateExerciseTypes < ActiveRecord::Migration
  def change
    create_table :exercise_types do |t|
      t.string :name, limit: 100
      t.string :short_name, limit: 30
      t.integer :exercise_number
      t.references :language, index: true, foreign_key: true
      t.references :exercise_category, index: true, foreign_key: true

      t.timestamps
    end
  end
end

class CreateExerciseCategories < ActiveRecord::Migration
  def change
    create_table :exercise_categories do |t|
      t.string :name, limit: 100
      t.string :short_name, limit: 30
      t.references :course, index: true, foreign_key: true

      t.timestamps
    end
  end
end

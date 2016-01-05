class CreateEventTemplates < ActiveRecord::Migration
  def change
    create_table :event_templates do |t|
      t.string :title, limit: 30
      t.integer :number
      t.references :course, index: true, foreign_key: true
      t.references :exercise_category, index: true, foreign_key: true

      t.timestamps
    end
  end
end

class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.datetime :date
      t.string :location, limit: 30
      t.integer :number
      t.string :title, limit: 30
      t.integer :number
      t.integer :attempt
      t.references :student_group, index: true, foreign_key: true
      t.references :event_template, index: true, foreign_key: true
      t.references :demonstrator, index: true, foreign_key: {to_table: :staff}
      t.references :exercise_type, index: true, foreign_key: true
      t.references :upstream_event, index: true, foreign_key: {to_table: :event}

      t.timestamps
    end
  end
end

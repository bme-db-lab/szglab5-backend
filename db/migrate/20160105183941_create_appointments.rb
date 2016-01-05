class CreateAppointments < ActiveRecord::Migration
  def change
    create_table :appointments do |t|
      t.datetime :date
      t.string :location, limit: 30
      t.references :student_group, index: true, foreign_key: true
      t.references :event_template, index: true, foreign_key: true

      t.timestamps
    end
  end
end

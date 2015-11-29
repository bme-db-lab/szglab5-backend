class CreateCourses < ActiveRecord::Migration
  def change
    create_table :courses do |t|
      t.string :code, null: false, index: { unique: true }
      t.string :name, null: false
    end
  end
end

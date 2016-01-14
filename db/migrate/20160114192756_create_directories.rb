class CreateDirectories < ActiveRecord::Migration
  def change
    create_table :directories do |t|
      t.string :description, limit: 30
      t.string :relative_path
      t.references :semester, index: true, foreign_key: true

      t.timestamps
    end
  end
end

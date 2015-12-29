class CreateLanguages < ActiveRecord::Migration
  def change
    create_table :languages do |t|
      t.string :code, limit: 3
      t.string :name, limit: 30

      t.timestamps
    end
  end
end

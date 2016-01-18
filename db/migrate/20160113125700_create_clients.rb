class CreateClients < ActiveRecord::Migration
  def change
    create_table :clients do |t|
      t.string :code
      t.string :name
      t.references :course, index: true, foreign_key: true
      t.references :default_language, index: true, foreign_key: {to_table: :language}
      t.references :extended_client, index: true, foreign_key: {to_table: :client}

      t.timestamps
    end
  end
end

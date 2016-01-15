class CreateMessages < ActiveRecord::Migration
  def change
    create_table :messages do |t|
      t.string :code
      t.string :message_text
      t.references :client, index: true, foreign_key: true
      t.references :language, index: true, foreign_key: true

      t.timestamps
    end
  end
end

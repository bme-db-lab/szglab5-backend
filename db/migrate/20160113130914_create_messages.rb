class CreateMessages < ActiveRecord::Migration
  def change
    create_table :messages do |t|
      t.string, :code
      t.string, :message_text
      t.client, :client
      t.language :language

      t.timestamps
    end
  end
end

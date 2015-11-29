class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      # Common attributes
      t.string :name, limit: 100, null: false, index: { unique: true }
      t.string :email, limit: 100, null: true, index: { unique: true }
      t.string :password_digest, limit: 100
      t.string :eppn, limit: 30, null: true, index: { unique: true }
      t.text   :ssh_public_keys, limit: 4.kilobytes

      # Student attributes (sti)
      t.string :neptun, limit: 6, null: true, index: { unique: true }
    end
  end
end

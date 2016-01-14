class CreateClients < ActiveRecord::Migration
  def change
    create_table :clients do |t|
      t.string, :code
      t.string, :name
      t.client, :extends
      t.course, :course
      t.language :default_language

      t.timestamps
    end
  end
end

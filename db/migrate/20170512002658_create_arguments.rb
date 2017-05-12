class CreateArguments < ActiveRecord::Migration[5.0]
  def change
    create_table :arguments do |t|
      t.string :name

      t.timestamps
    end
  end
end

class SourcesController < ApplicationController
  before_action :set_source, only: [:show, :edit, :update, :destroy]

  # GET /sources
  # GET /sources.json
  def index
    @sources = Source.includes(:premises).all
  end

  # GET /sources/1
  # GET /sources/1.json
  def show
  end

  # GET /sources/new
  def new
    @source = Source.new
  end

  # GET /sources/1/edit
  def edit
  end

  # POST /sources
  # POST /sources.json
  def create

    respond_to do |format|
      begin
        ActiveRecord::Base.transaction do
          @source = Source.new(source_params)
          @source.save!
          @source.premise_ids = premise_ids[:premise_ids]
          format.html {redirect_to @source, notice: 'Source was successfully created.'}
          format.json {render :show, status: :created, location: @source}
        end
      rescue ActiveRecord::RecordInvalid
        format.html {render :new}
        format.json {render json: @source.errors, status: :unprocessable_entity}
      end
    end
  end

  # PATCH/PUT /sources/1
  # PATCH/PUT /sources/1.json
  def update
    respond_to do |format|
      begin
        ActiveRecord::Base.transaction do
          @source.update(source_params)
          @source.premise_ids = premise_ids[:premise_ids]
          format.html {redirect_to @source, notice: 'Source was successfully updated.'}
          format.json {render :show, status: :ok, location: @source}
        end
      rescue ActiveRecord::RecordInvalid
        format.html {render :edit}
        format.json {render json: @source.errors, status: :unprocessable_entity}
      end
    end
  end

  # DELETE /sources/1
  # DELETE /sources/1.json
  def destroy
    @source.destroy
    respond_to do |format|
      format.html {redirect_to sources_url, notice: 'Source was successfully destroyed.'}
      format.json {head :no_content}
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_source
    @source = Source.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def source_params
    params.require(:source).permit(:name)
  end

  def premise_ids
    params.permit(:premise_ids => [])
  end

end
